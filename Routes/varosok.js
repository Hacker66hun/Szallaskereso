import pool from "../Data/db.js";
import { Router } from "express";
const varosokRoutes = Router();

varosokRoutes.get("/", async (req,res) => {
    let params = [];
    let having = "";
    const {minSzallas} = req.query;
    if(minSzallas) {
        if(!Number.isInteger(Number(minSzallas)) || Number(minSzallas) < 0) return res.status(400).json({hiba:"Hibás minSzallas érték!"});
        having = " HAVING COUNT(szallasok.id) >= ?";
        params.push(Number(minSzallas));
    }
    let sql = `SELECT varosok.id, varosok.nev, varosok.orszag, COUNT(szallasok.id) AS szallasDb, MIN(szallasok.ar) AS legolcsobb, ROUND(AVG(szallasok.ar),0) AS atlagAr FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.id, varosok.nev, varosok.orszag`;
    sql += having;
    sql += " ORDER BY varosok.nev ASC";
    let [eredmeny] = await pool.query(sql,params);
    res.json(eredmeny);
});

varosokRoutes.get("/:id/szallasok", async (req,res) => {
    let [varos] = await pool.query(`SELECT id FROM varosok WHERE id = ?`,[req.params.id]);
    if(varos.length === 0) return res.status(404).json({hiba:"A város nem található!"});
    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev AS varos, varosok.orszag, szallasok.csillag, szallasok.ar, szallasok.medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id WHERE varosok.id = ? ORDER BY szallasok.ar ASC`;
    let [eredmeny] = await pool.query(sql,[req.params.id]);
    eredmeny = eredmeny.map(x => ({...x,medence:Boolean(x.medence),ertekeles:Number(x.ertekeles)}));
    res.json(eredmeny);
});
export default varosokRoutes;