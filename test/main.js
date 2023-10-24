/* External Imports */
// const { ethers, network,} = require('hardhat')
const { ethers, getChainId, upgrades, network } = require('hardhat')
const { utils } = require('ethers')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect, assert } = chai


chai.use(solidity)

describe(`main process`, () => {


  let dataContract;
  before(`deploy contact and setting `, async () => {



    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await ethers.getSigners();
    let deployer = accounts[0];

    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    let dataContractFactory = await ethers.getContractFactory("DataContract",deployer);

    dataContract = await upgrades.deployProxy(
        dataContractFactory,
        [
        ],
        {
            initializer:  "initialize",
            unsafeAllowLinkedLibraries: true,
        }
    );

    console.log("data contract address :",dataContract.address);




  })


  it('main process checkStatus', async function () {

    let txObj = await dataContract.setCredaFee(0);
    let txRep = await txObj.wait();
    console.log(txRep.status);


    let merkleRoot = "0xad1aa5d95b0fb90f10a7e65d0cc24e3d2e4ef3d52ef7ece98bf66da0f1f8bcfc";
    let proof = [ "0x118a4bf476dc9b9aab0c731b944d02b577282b7d7aae76b1222190b19ed07470","0xb5e26055d168205dc6e3be0555a415adba11c12d493adda3f1dedb5ca1da6bbd"]
    let address = "0x3770219B0F2ED1986E46FaE53b5D1A70d5a32eAb"
    let score = 800;
    let leaf = "196dc3eb84a4901859c41729815bed7b34ff0c8fa3dc9663ed4f0bc5d479a091"

    // function checkStatus(
    //     address _address,
    //     uint256 credit,
    //     bytes32[] memory merkleProof
    // ) public view returns (bool flag) {
    //     bytes32 leaf = hash(_address, credit);
    //     flag = MerkleProof.verify(merkleProof, merkleRoot, leaf);
    // }
    
    txObj= await dataContract.setMerkleRoot(merkleRoot);
    txRep = await txObj.wait();
    console.log(txRep.status);


    let result = await dataContract.checkStatus(address,score,proof);
    console.log(result);



  })

})
