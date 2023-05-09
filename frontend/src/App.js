import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Signup, Login, Dashboard } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
