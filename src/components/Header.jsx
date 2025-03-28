import React from 'react';

const Header = ({ today, placeName }) => {
    return (
        <h2>{today} {placeName}</h2>
    );
};

export default Header;