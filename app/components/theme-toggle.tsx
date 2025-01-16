'use client'

import React, { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
const [theme, setTheme] = useState('light');

useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
}, [theme]);

const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
};

return <button onClick={toggleTheme} className="text-green-500">Toggle Theme</button>;
};