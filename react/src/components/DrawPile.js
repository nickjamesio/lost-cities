import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from '../components/Card';
import CardCount from '../components/CardCount';

const styles = {};

const DrawPile = (props) => {
    const { className: classNameProp, drawPile, handleClick } = props;
    const className = classNames(classNameProp);

    return (
        <CardCount cards={drawPile} className={className} handleClick={handleClick}>
            {() => <Card type="back" />}
        </CardCount>
    );
};


export default withStyles(styles)(DrawPile)