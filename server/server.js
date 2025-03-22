import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import "dotenv/config";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// Configure static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log("MySQL connected.");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
// Initialize upload middleware
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize upload middleware with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for pdfs and images
  },
});

//all the voter apis
{
  app.post("/register", upload.single("profile_photo"), async (req, res) => {
    console.log("Register endpoint hit");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    // Extract form fields from req.body
    const {
      name,
      dob,
      email,
      voter_id,
      address,
      aadhar_number,
      wallet_address,
    } = req.body;

    // Get the file path if uploaded
    const profilePhoto = req.file ? req.file.path : null;

    const sql = `INSERT INTO voters (name, dob, email, voter_id, address, aadhar_number, wallet_address, profile_photo) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      name || null,
      dob || null,
      email || null,
      voter_id || null,
      address || null,
      aadhar_number || null,
      wallet_address || null,
      profilePhoto,
    ];

    console.log("Prepared values: ", values);

    try {
      const [result] = await db.execute(sql, values);
      res.json({ success: true, data: result });
    } catch (err) {
      console.error(err);
      if (err.code === "ER_DUP_ENTRY") {
        let field = "A field";
        if (err.sqlMessage.includes("email")) field = "Email";
        else if (err.sqlMessage.includes("unique_aadhar"))
          field = "Aadhar Number";
        else if (err.sqlMessage.includes("voter_id")) field = "Voter ID";
        else if (err.sqlMessage.includes("wallet_address"))
          field = "Wallet Address";
        return res
          .status(400)
          .json({ success: false, message: `${field} already exists.` });
      }
      res
        .status(500)
        .json({ success: false, message: "Error registering voter" });
    }
  });

  app.get("/check-wallet/:wallet_address", async (req, res) => {
    const { wallet_address } = req.params;

    try {
      const [rows] = await db.execute(
        "SELECT * FROM voters WHERE wallet_address = ?",
        [wallet_address]
      );

      if (rows.length > 0) {
        res.json({ exists: true, voter: rows[0] });
      } else {
        res.json({ exists: false });
      }
    } catch (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error checking wallet address" });
    }
  });
  app.get("/voter/:wallet_address", async (req, res) => {
    const { wallet_address } = req.params;

    try {
      const [rows] = await db.execute(
        "SELECT * FROM voters WHERE wallet_address = ?",
        [wallet_address]
      );

      if (rows.length > 0) {
        res.json({ success: true, voter: rows[0] });
      } else {
        res.status(404).json({ success: false, message: "Voter not found" });
      }
    } catch (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error fetching voter data" });
    }
  });
}

//all the candidate apis
{
  app.post(
    "/registerCandidate",
    upload.single("document"),
    async (req, res) => {
      console.log("Register candidate endpoint hit");
      console.log("Request body:", req.body);
      console.log("File:", req.file);

      const { party, manifesto, wallet_address } = req.body;
      const documentPath = req.file ? req.file.path : null;

      try {
        // Check if voter exists
        const [voter] = await db.execute(
          "SELECT * FROM voters WHERE wallet_address = ?",
          [wallet_address]
        );

        if (voter.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Voter not found" });
        }

        // Check if already a candidate
        const [existingCandidate] = await db.execute(
          "SELECT * FROM candidates WHERE wallet_address = ?",
          [wallet_address]
        );

        if (existingCandidate.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Already registered as a candidate",
          });
        }

        // Insert candidate details
        const sql = `INSERT INTO candidates (wallet_address, party, manifesto, document) VALUES (?, ?, ?, ?)`;
        const values = [wallet_address, party, manifesto, documentPath];

        const [result] = await db.execute(sql, values);

        res.json({
          success: true,
          message: "Candidate registered successfully",
          data: { wallet_address, party, manifesto, document: documentPath },
        });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Error registering candidate" });
      }
    }
  );
  app.get("/candidate/:wallet_address", async (req, res) => {
    const { wallet_address } = req.params;

    try {
      // First, fetch the voter's ID using wallet address
      const [voterRows] = await db.execute(
        "SELECT id FROM voters WHERE wallet_address = ?",
        [wallet_address]
      );

      if (voterRows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Voter not found" });
      }

      // const wallet_address = voterRows[0].wallet_address;

      // Now, fetch the candidate details using the voter's ID
      const [candidateRows] = await db.execute(
        "SELECT * FROM candidates WHERE wallet_address = ?",
        [wallet_address]
      );

      if (candidateRows.length > 0) {
        res.json({ success: true, candidate: candidateRows[0] });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Candidate not found" });
      }
    } catch (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error fetching candidate data" });
    }
  });
  app.get("/candidates", async (req, res) => {
    try {
      const [candidates] = await db.execute(`SELECT 
    v.*,
    c.party,
    c.manifesto,
    c.document
  FROM 
    voters v
  LEFT JOIN 
    candidates c ON v.wallet_address = c.wallet_address`);
      res.json({ success: true, candidates });
    } catch (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error fetching candidates" });
    }
  });
}
// DELETE fROM voters WHERE email="voter2@dummy.do"

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 2MB.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // Some other error occurred
    return res.status(500).json({ success: false, message: err.message });
  }
  next();
});

const [rows] = await db.execute(`
   SELECT 
    v.*,
    c.party,
    c.manifesto,
    c.document
  FROM 
    voters v
  LEFT JOIN 
    candidates c ON v.wallet_address = c.wallet_address
`);
console.log(rows);

app.listen(process.env.DB_PORT, () => {
  console.log(`listening on port ${process.env.DB_PORT}`);
});
