# Crypto-Ballot
Crypto Ballot is a blockchain-based voting platform that revolutionizes elections by ensuring secure, transparent, and tamper-proof voting. This project uses Hardhat to simulate a real blockchain network for development and testing.

## To run the project:
1. Download the whole directory
2. Open the directory in any Code Editor like VSCode
3. Open each sub-directory (client, server, smart_contract) in the terminal one by one and run ```npm install```
   
   ## Configuring deployment on blockchain (hardhat simulates):
4. Open the directory smart_contract and run in the terminal ```npx hardhat compile```
5. Now run ```npx hardhat node``` and copy the JSON-RPC server address and the private key of Account0 and paste in the .env file (omit the '0x' if there's a problem)
6. Now in the file hardhat.config.js uncomment the localhost network declaration
7. Don't close the current terminal because here you will see the transaction status and the method that our application calls from blockchain
8. Open another terminal and within the same directory, run ```npx hardhat run scripts/deploy.js --network localhost```, now copy the contract address and go to client/scr/utils/constants.js and paste it in contractAddress
9. Also check in smart_contract/artifacts/contracts/ that there is a file created Elections.json, you can simply drag and move this file or copy it in the directory client/src/utils/ so that constants.js can fetch the abi (Application Binary Interface)
    
    ## Running the server:
10. Go to the link: https://dev.mysql.com/downloads/installer/ and install the one which appears like
    

    
     ![image](https://github.com/user-attachments/assets/aef10ed8-fa48-4f91-b063-129a138711c5)


11. After successful download and installation, create a new schema named "db_cryptoballot" (this is what I used in my project)
12. Open a new sql tab and make sure that your schema is selected then execute the following statement:
    ```

       CREATE TABLE `voters` (
             `id` int NOT NULL AUTO_INCREMENT,
             `name` varchar(100) NOT NULL,
             `dob` varchar(100) NOT NULL,
             `email` varchar(100) NOT NULL,
             `voter_id` varchar(100) NOT NULL,
             `address` varchar(100) NOT NULL,
             `aadhar_number` bigint unsigned DEFAULT NULL,
             `wallet_address` varchar(255) NOT NULL,
             `profile_photo` varchar(255) DEFAULT NULL,
             PRIMARY KEY (`id`),
             UNIQUE KEY `email` (`email`),
             UNIQUE KEY `voter_id` (`voter_id`),
             UNIQUE KEY `unique_wallet` (`wallet_address`),
             UNIQUE KEY `unique_aadhar` (`aadhar_number`)
           );
           CREATE TABLE `candidates` (
             `wallet_address` varchar(255) NOT NULL,
             `party` varchar(255) NOT NULL,
             `manifesto` text NOT NULL,
             `document` varchar(255) NOT NULL,
             PRIMARY KEY (`wallet_address`),
             CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`wallet_address`) REFERENCES `voters` (`wallet_address`)
           );

    ```
    
14. Now go the server directory and configure the .env file, now run ```npm run dev``` and don't close the terminal

    ## Running the application:
15. Go to the client directory and run ```npm run dev``` and don't close the terminal
17. Open your browser and go to localhost:5173 or check the terminal what it says
18. You need to install Metamask Browser extension and create an account
19. Add a custom network in the extension named ```localhost```, paste your RPC URL from your smart_contract terminal, chain ID: 31337, currency symbol: ETH, ignore the warnings and save
20. Make sure when using the application, switch to the localhost network on your metamask extension


    ### I hope you saved all the files and the application is running. 
