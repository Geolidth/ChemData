import { Elysia } from "elysia";
import { ChemicalModel } from "../models/chemical";

export const pubchemRoutes = new Elysia({ prefix: "/pubchem" })
  .get("/import/:cid", async ({ params, set }) => {
    try {
      const cid = Number(params.cid);
      if (isNaN(cid)) {
        set.status = 400;
        return { success: false, message: "Érvénytelen PubChem CID formátum!" };
      }
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,IUPACName,MolecularWeight,SMILES,InChI,InChIKey/json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        set.status = 404;
        return { success: false, message: "A megadott CID nem található a PubChem adatbázisában." };
      }

      const data = await response.json();
      const props = data.PropertyTable.Properties[0];
      console.log("PubChem API válasz:", props);
      const existing = await ChemicalModel.findOne({ pubchem_cid: cid });
      if (existing) {
        set.status = 409;
        return { success: false, message: "Ez a vegyület már szerepel az adatbázisban ezzel a CID-vel!", data: existing };
      }
      const newChemical = new ChemicalModel({
        name: props.IUPACName || "Ismeretlen vegyület",
        formula: props.MolecularFormula,
        type: "compound",
        molecular_weight: props.MolecularWeight,
        properties: {
          source: "PubChem API",
          smiles: props.SMILES,
          pubchem_cid: cid,
          InChI: props.InChI,
          InChIKey: props.InChIKey
        },
        tags: ["pubchem-import"]
      });
      console.log("Importálandó vegyület adatai:", newChemical);

      const savedChemical = await newChemical.save();

      set.status = 201;
      return {
        success: true,
        message: "Sikeresen importálva a PubChem-ről!",
        data: savedChemical
      };

    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: "Hiba történt a PubChem importálás során",
        error: error.message
      };
    }
  });