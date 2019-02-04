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
        minWidth: '6rem',
        minHeight: '7rem'
    },
    bottom: {
        justifyContent: 'flex-end'
    },
    top: {
        justifyContent: 'flex-start'
    }
};

const CardStack = (props) => {
    const {
        cards,
        type,
        classes,
        className: classNameProp,
        direction
    } = props;
    const className = classNames(
        classes.root,
        classNameProp,
        direction == 'top' ? classes.top : classes.bottom)

    return (
        <div className={className}>
            {cards.map((value, index) => (
                <Card
                    key={index}
                    type={type}
                    value={value}
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