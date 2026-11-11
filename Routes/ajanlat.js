import pool from "../Data/db.js";
import { Router } from "express";
const ajanlatRoutes = Router();

ajanlatRoutes.get("/", async (req,res) => {
    const {varos,ej,fo} = req.query;
    let hibak = [];
    if(!varos) hibak.push("A város megadása kötelező!");
    if(!ej || !Number.isInteger(Number(ej)) || Number(ej) <= 0) hibak.push("Az éjszakák száma pozitív egész kell legyen!");
    if(!fo || !Number.isInteger(Number(fo)) || Number(fo) <= 0) hibak.push("A fő száma pozitív egész kell legyen!");
    if(hibak.length > 0) return res.status(400).json({hibak});
    let sql = `SELECT varosok.nev AS varos, szallasok.nev AS szallas, szallasok.csillag, szallasok.ar AS arFoEj, szallasok.ar * ? * ? AS osszesen FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id WHERE varosok.nev = ? ORDER BY osszesen ASC`;
    let [eredmeny] = await pool.query(sql,[Number(ej),Number(fo),varos]);
    if(eredmeny.length === 0) return res.status(404).json({hiba:"A város nem található!"});
    res.json({varos:eredmeny[0].varos,ej:Number(ej),fo:Number(fo),ajanlatok:eredmeny.map(x => ({szallas:x.szallas,csillag:x.csillag,arFoEj:x.arFoEj,osszesen:x.osszesen}))});
});

export default ajanlatRoutes;