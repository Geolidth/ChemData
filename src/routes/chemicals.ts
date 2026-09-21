import { Elysia } from "elysia";
import { ChemicalModel } from "../models/chemical";

export const chemicalsRoutes = new Elysia({ prefix: "/chemicals" })
  .get("/", async ({ set }) => {
    try {
      const chemicals = await ChemicalModel.find();
      set.status = 200;
      return {
        success: true,
        message: "Sikeresen lekérdezve!",
        length: chemicals.length,
        data: chemicals
      };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Hiba a lekérdezés során!" };
    }
  })
  .get("/:id", async ({ params, set }) => {
    try {
      const chemical = await ChemicalModel.findById(params.id);
      if (!chemical) {
        set.status = 404;
        return { success: false, message: "A vegyület nem található!" };
      }
      set.status = 200;
      return { success: true, data: chemical };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Érvénytelen ID formátum!" };
    }
  })
  .post("/", async ({ set, body }) => {
    try {
      const newChemical = new ChemicalModel(body);
      const savedChemical = await newChemical.save();
      
      set.status = 201;
      return {
        success: true,
        message: "Sikeresen mentve!",
        data: savedChemical
      };
    } catch (error: any) {
      set.status = 400;
      return {
        success: false,
        message: "Validációs hiba",
        error: error.message
      };
    }
  })
  .delete("/:id", async ({ params, set }) => {
    try {
      const deletedChemical = await ChemicalModel.findByIdAndDelete(params.id);
      if (!deletedChemical) {
        set.status = 404;
        return { success: false, message: "A törlendő vegyület nem található!" };
      }
      set.status = 200;
      return { success: true, message: "Sikeresen törölve!" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Érvénytelen ID formátum!" };
    }
  });