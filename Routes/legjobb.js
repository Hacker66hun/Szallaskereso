import pool from "../Data/db.js";
import { Router } from "express";
const legjobbRoutes = Router();

legjobbRoutes.get("/:n", async (req,res) => {
    const n = Number(req.params.n);
    if(!Number.isInteger(n) || n <= 0) return res.status(400).json({hiba:"Hibás darabszám!"});
    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev AS varos, varosok.orszag, szallasok.csillag, szallasok.ar, szallasok.medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id ORDER BY szallasok.ertekeles DESC LIMIT ?`;
    let [eredmeny] = await pool.query(sql,[n]);
    eredmeny = eredmeny.map(x => ({...x,medence:Boolean(x.medence),ertekeles:Number(x.ertekeles)}));
    res.json(eredmeny);
});

export default legjobbRoutes;