import pool from "../Data/db.js";
import { Router } from "express";
const szallasokRoutes = Router();

szallasokRoutes.get("/", async (req,res) => {
    let params = [];
    let szurok = [];
    const {varos,minCsillag,maxAr,medence} = req.query;
    if(varos) {
        szurok.push("varosok.nev = ?");
        params.push(varos);
    }
    if(minCsillag) {
        if(Number(minCsillag) < 1 || Number(minCsillag) > 5) return res.status(400).json({hiba:"A minCsillag értéke 1 és 5 között lehet!"});
        szurok.push("szallasok.csillag >= ?");
        params.push(Number(minCsillag));
    }
    if(maxAr) {
        if(Number(maxAr) <= 0) return res.status(400).json({hiba:"A maxAr értéke pozitív kell legyen!"});
        szurok.push("szallasok.ar <= ?");
        params.push(Number(maxAr));
    }
    if(medence) {
        if(medence !== "true" && medence !== "false") return res.status(400).json({hiba:"A medence értéke true vagy false lehet!"});
        szurok.push("szallasok.medence = ?");
        params.push(medence === "true" ? 1 : 0);
    }
    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev AS varos, varosok.orszag, szallasok.csillag, szallasok.ar, szallasok.medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id`;
    if(szurok.length > 0) sql += " WHERE " + szurok.join(" AND ");
    sql += " ORDER BY szallasok.ar ASC";
    let [eredmeny] = await pool.query(sql,params);
    eredmeny = eredmeny.map(x => ({...x,medence:Boolean(x.medence),ertekeles:Number(x.ertekeles)}));
    res.json(eredmeny);
});

szallasokRoutes.get("/:id", async (req,res) => {
    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev AS varos, varosok.orszag, szallasok.csillag, szallasok.ar, szallasok.medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id WHERE szallasok.id = ?`;
    let [eredmeny] = await pool.query(sql,[req.params.id]);
    if(eredmeny.length === 0) return res.status(404).json({hiba:"A szállás nem található!"});
    eredmeny[0].medence = Boolean(eredmeny[0].medence);
    eredmeny[0].ertekeles = Number(eredmeny[0].ertekeles);
    res.json(eredmeny[0]);
});
export default szallasokRoutes;