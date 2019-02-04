import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from '../components/Card';

const styles = {};

const DrawPile = (props) => {
    const { className: classNameProp } = props;
    const className = classNames(classNameProp);

    return (
        <div className={className}>
            <Card type="back" />
        </div>
    );
};


export default withStyles(styles)(DrawPile)