import React, { Component } from 'react';

import Aux from '../../hoc/Auxi/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENTS_PRICES = {
    salad : 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients : null,
        totalPrice: 4,
        purchaseable: false,
        purchase: false,
        loading: false,
        error: false
    }

    componentDidMount = () => {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error:true});
            });
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
        // alert('You Continue...');
        // this.setState({ loading: true });
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price : this.state.totalPrice,
        //     customer: {
        //         name: 'Fazal Mahmood',
        //         address:{
        //             street: 'test street 1',
        //             zipCode: '342425',
        //             country: 'Pakistan'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({loading:false, purchase: false});
        //     })
        //     .catch(error =>  {
        //         this.setState({loading:false, purchase: false});
        //     });
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '='+ encodeURIComponent(this.state.ingredients[i]));
        }
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString,
        });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        // output like this: {salad: true, meat: false}.....
        
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p>:<Spinner />;

        if(this.state.ingredients){ 
            burger = (
                <Aux>
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
            orderSummary = <OrderSummary ingredients={this.state.ingredients} 
                            purchasedContinued={this.purchasedContinueHandler}
                            purchasedCanceled={this.purchasedCancelHandler} 
                            price={this.state.totalPrice} />;
        }
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchase} modalClosed={this.purchasedCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}


export default withErrorHandler(BurgerBuilder, axios);