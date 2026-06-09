
import "../styles/filters.css";
import {useEffect, useState} from "react"
import {getVersions} from "../services/api.js"
import logo from "../assets/transire-img.png";
import logoAmazonas from "../assets/amazonas.png";
import Grid from "../components/Grid.jsx"


export default function Filters({ search, setSearch }) {

  return (
    <div className="toolbar">

        <input
            className="search-space"
            placeholder="Busque por cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar-logo-container">
            <img
                src={logo}
                alt="Logo"
                className="toolbar-logo" />
        </div>

    </div>

  );
}