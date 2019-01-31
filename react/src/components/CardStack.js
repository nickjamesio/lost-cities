import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Card from '../components/Card';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '0.5rem',
    },
    bottom: {
        justifyContent: 'flex-end'
    },
    top: {
        justifyContent: 'flex-start'
    }
};

const CardStack = (props) => {
    const { cards, classes, className: classNameProp, direction } = props;
    const className = classNames(
        classes.root,
        classNameProp,
        direction == 'top' ? classes.top : classes.bottom)

    return (
        <div className={className}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    type={card.type}
                    value={card.value}
                    covered={index !== cards.length - 1}
                />
            ))}
        </div>
    );
};

CardStack.propTypes = {
    direction: PropTypes.string.isRequired
};

export default withStyles(styles)(CardStack);