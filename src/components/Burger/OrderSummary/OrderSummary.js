import React from 'react';

import Aux from '../../../hoc/Auxi/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientsSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: 
                    {props.ingredients[igKey]}
                </li>
            );
        });
    return (
        <Aux>
            <h3>Order Summary</h3>
            <p>A delicious burger with following ingredients: </p>
            <ul>
                { ingredientsSummary }
            </ul>
            <p><strong>Total Price: $ {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button btnType="Danger" clicked={props.purchasedCanceled}> CANCEL</Button>
            <Button btnType="Success" clicked={props.purchasedContinued}>CONTINUE</Button>
        </Aux>
    );
};

export default orderSummary;