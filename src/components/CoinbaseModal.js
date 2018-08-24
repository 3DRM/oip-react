import React, { Component } from 'react';

/**
 * Use this component like this: 
 * 
 * <CoinbaseModal 
 * 		currency="bitcoin" 
 * 		address="1FjQxmrue5jdgVhmVMN3Y4XjXdtiDC257K" 
 * 		amount={1} isOpen={true} 
 * 		
 * 		onClose={(data) => {
 * 			console.log("CoinbaseModal onClose!! ", data)
 * 		}} 
 * 		onCancel={(data) => {
 * 			console.log("CoinbaseModal onCancel!! ", data)
 * 		}} 
 * 		onSuccess={(data) => {
 * 			console.log("CoinbaseModal onSuccess!! ", data)
 * 		}} 
 * />
 */

class CoinbaseModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: true
		}

		this.domain = "https://buy.coinbase.com";
		this.currency = {
			btc: {
				code: "845aa197-be38-5b8f-ad91-862958e78ce0"
			},
			ltc: {
				code: "169c6c3a-d404-55f4-82f4-24cd25f5c5f6"
			}
		}

		let _this = this;

		window.addEventListener("message", (e) => {
			// If we are not listening to messages from the host coinbase application, then ignore!
			if (e.origin !== "https://buy.coinbase.com")
				return;

			console.log(e);

			switch (e.data.event) {
				case "modal_closed":
					_this.setState({isOpen: false});
					if (_this.refs && _this.refs.cb){
						_this.refs.cb = null;
					}
					_this.props.onClose(e.data)
					break;
				case "buy_completed":
					_this.setState({isOpen: false});
					if (_this.refs && _this.refs.cb){
						_this.refs.cb = null;
					}
					_this.props.onSuccess(e.data)
					break;
				case "buy_canceled":
					_this.setState({isOpen: false});
					if (_this.refs && _this.refs.cb){
						_this.refs.cb = null;
					}
					_this.props.onCancel(e.data)
					break;
			}
		}, !1)
	}
	componentDidMount(){
		
	}
	componentWillUnmount() {
		this.refs.cb = null;
	}
	render() {
		let currency = this.props.currency

		if (currency === "bitcoin")
			currency = "btc"
		else if (currency === "litecoin")
			currency = "ltc"

		let srcString = this.domain + "/" + 
		"?address=" + encodeURIComponent(this.props.address) + 
		("&amount=" + encodeURIComponent(this.props.amount)) + 
		("&code=" + encodeURIComponent(this.currency[currency].code)) + 
		("&currency=" + encodeURIComponent("usd")) + 
		("&crypto_currency=" + encodeURIComponent(currency));

		return (
			<div style={{display: "inline"}}>
				<iframe title="coinbaseModal" ref="cb" src={srcString}
				style={{
					transition: "all 0.3s ease-out", 
					backgroundColor: "transparent", 
					border: "0px none transparent", 
					display: (this.props.isOpen && this.state.isOpen) ? "block" : "none", 
					position: "fixed", 
					visibility: "visible", 
					margin: "0px", 
					padding: "0px", 
					left: "0px", 
					top: "0px", 
					width: "100%", 
					height: "100%", 
					zIndex: "9999"
				}} scrolling='no' allowtransparency='true' frameBorder='0'/>
			</div>
		);
	}
}

export default CoinbaseModal;