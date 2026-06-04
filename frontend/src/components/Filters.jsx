
import "../styles/filters.css";
import {useEffect, useState} from "react"
import {getVersions} from "../services/api.js"
import logo from "../assets/transire-img.png";
import Grid from "../components/Grid.jsx"


export default function Filters({ search, setSearch }) {

    // const [search, setSearch] = useState("");
    // const [data, setData] = useState([]);

    // useEffect(() => {

    //     const delayDebounce = setTimeout(() => {
    //     const fetchData = async () => {
    //     const res = await getVersions(search);

    //     setData([...res.data]);
    // };

    // fetchData();
    // }, 500);

    // return () => clearTimeout(delayDebounce);
    // }, [search]);

    // console.log(data);


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