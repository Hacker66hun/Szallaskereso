import pool from "../Data/db.js";
import { Router } from "express";
const orszagokRoutes = Router();

orszagokRoutes.get("/", async (req,res) => {
    let sql = `SELECT varosok.orszag, COUNT(DISTINCT varosok.id) AS varosDb, COUNT(szallasok.id) AS szallasDb, ROUND(AVG(szallasok.ertekeles),2) AS atlagErtekeles FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.orszag ORDER BY varosok.orszag ASC`;
    let [eredmeny] = await pool.query(sql);
    eredmeny = eredmeny.map(x => ({...x,atlagErtekeles:x.atlagErtekeles === null ? null : Number(x.atlagErtekeles)}));
    res.json(eredmeny);
});

export default orszagokRoutes;