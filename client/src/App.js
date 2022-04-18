import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json"
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, cost: 0, itemName: "Item 1" };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();

      this.accounts = await this.web3.eth.getAccounts();

      this.networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      this.setState({ loaded: true });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(2).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleInputChange = (event) => {
    const target = event.target;

    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = async () => {
    const { cost, itemName } = this.state;

    await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Event Trigger / Supply Chain Example</h1>
        <h2>Items</h2>
        <h2>Add Items</h2>
        <label>
          Cost in wei:
        </label>
        <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
        <label>
          Item identifier:
        </label>
        <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleSubmit} />
        <button type="button" onClick={this.handleSubmit}>create new item</button>
      </div>
    );
  }
}

export default App;
