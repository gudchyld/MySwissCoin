const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/swisstronik.js");

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the Hardhat network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign the transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Address of the deployed contract
  const contractAddress = "0x64FCDa88823b82d9953be574c74A49967aa45Fa1";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("MySwissCoin");
  const contract = contractFactory.attach(contractAddress);

  // Send a shielded transaction to execute a transaction in the contract
  const functionName = "mint";
  const functionArgs = ["0x3B2200b3DfA63D121D475f6a406A0D6d205251B6", "120000000000000000000"];
  const transaction = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, functionArgs),
    0
  );

  await transaction.wait();

  // It should return a TransactionResponse object
  console.log("Transaction Response: ", transaction);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
