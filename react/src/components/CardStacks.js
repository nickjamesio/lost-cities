import React from 'react';
import { withStyles } from '@material-ui/core';
import CardStack from '../components/CardStack';


const styles = {
    root: {
        display: 'flex',
        maxWidth: '70rem',
        minWidth: '70rem',
        justifyContent: 'space-between',
        marginLeft: '10rem'
    },
    stack: {
        // paddingLeft: '10rem'
    }
};

const CardStacks = (props) => {
    const { classes, stacks, direction} = props;
    const stackOrder = ['red', 'green', 'white', 'blue', 'yellow'];

    return (
        <div className={classes.root}>
            {stackOrder.map(color => {
                return <CardStack
                            key={color}
                            className={classes.stack}
                            direction={direction}
                            type={color}
                            cards={stacks[color]}
                        />
            })}
        </div>
    );
};


export default withStyles(styles)(CardStacks);