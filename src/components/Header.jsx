import React from 'react';

const Header = ({ today, placeName }) => {
    return (
        <div className='head'>
            <h1>Habit Tracker</h1>
            <h2>{today} </h2>
            <p>{placeName}</p>
        </div>
    );
};

export default Header;