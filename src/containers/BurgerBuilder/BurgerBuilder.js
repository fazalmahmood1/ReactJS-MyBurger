import React, { Component } from 'react';

import Aux from '../../hoc/Auxi/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENTS_PRICES = {
    salad : 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false,
        purchase: false
    }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            },0);
        this.setState({purchaseable: sum > 0});    
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;

        const updatedIngredient = {
            ...this.state.ingredients
        }

        updatedIngredient[type] = updateCount;
        const priceAddition = INGREDIENTS_PRICES[type];

        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }

        const updateCount = oldCount - 1;
        const updatedIngredient = {
            ...this.state.ingredients
        }

        updatedIngredient[type] = updateCount;
        const priceDeduction = INGREDIENTS_PRICES[type];

        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    purchaseHandler = () => {
        this.setState({purchase: true});
    }

    purchasedCancelHandler = () => {
        this.setState({purchase: false});
    }

    purchasedContinueHandler = () => {
        alert('You Continue...');
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        // output like this: {salad: true, meat: false}.....
        
        return (
            <Aux>
                <Modal show={this.state.purchase} modalClosed={this.purchasedCancelHandler}>
                    <OrderSummary ingredients={this.state.ingredients} 
                        purchasedContinued={this.purchasedContinueHandler}
                        purchasedCanceled={this.purchasedCancelHandler} 
                        price={this.state.totalPrice} />
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice} 
                    ordered={this.purchaseHandler}/>
            </Aux>
        );
    }
}


export default BurgerBuilder;