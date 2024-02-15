import PropTypes from 'prop-types';
import '../App.css';
import React from 'react';

import { useEffect } from 'react';

export default function Highlighter({ point }) {
  return (
    <div
      className="highlighter"
      style={{
        top: `${0}px`,
        left: `${-40}px`,
        width: `${40}px`,
        height: `${40}px`,
      }}
    ></div>
  );
}

Highlighter.propTypes = {};
