import { Injectable } from "@angular/core";

export interface WeekOption {
  weekNumber: number;
  label: string;
}

export interface RegistroAgrupado {
  semana: number;
  dia: number;
  proteinas?: number;
  carbs?: number;
  grasas?: number;
  caloriasTotales: number;
}
/**
 * @description
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  getWeeksOfYear(year: number): {
    weeks: WeekOption[];
    currentWeek: number;
  } {
    const weeks: WeekOption[] = [];
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);

    let currentDate = new Date(firstDayOfYear);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // primer lunes

    let weekNumber = 1;

    while (currentDate <= lastDayOfYear) {
      weeks.push({
        weekNumber,
        label: `Semana ${weekNumber}`
      });

      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }

    // Calcular la semana actual
    const today = new Date();
    const startOfYear = new Date(year, 0, 1);
    const daysPassed = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.ceil((daysPassed + startOfYear.getDay() + 1) / 7);

    return {
      weeks,
      currentWeek
    };
  }

  agruparPorDia(data: any[]): RegistroAgrupado[] {
    const mapa = new Map<string, RegistroAgrupado>();

    data.forEach(item => {
      const key = `${item.semana}-${item.dia}`;
      const tipoNombre = item.expand?.idRel_catalogo_calorias?.nombre?.toLowerCase(); // <- CORRECTO

      if (!mapa.has(key)) {
        mapa.set(key, {
          semana: item.semana,
          dia: item.dia,
          caloriasTotales: 0
        });
      }

      const entrada = mapa.get(key)!;

      if (tipoNombre?.includes('prote')) entrada.proteinas = item.calorias;
      if (tipoNombre?.includes('carbo')) entrada.carbs = item.calorias;
      if (tipoNombre?.includes('grasa')) entrada.grasas = item.calorias;

      entrada.caloriasTotales += item.calorias || 0;
    });

    return Array.from(mapa.values());
  }

  calcularPromedios(registros: RegistroAgrupado[]) {
    const total = registros.length;
    let data: any = {};
    const suma = registros.reduce(
      (acc, item) => {
        acc.proteinas += item.proteinas || 0;
        acc.carbs += item.carbs || 0;
        acc.grasas += item.grasas || 0;
        acc.calorias += item.caloriasTotales || 0;
        return acc;
      },
      { proteinas: 0, carbs: 0, grasas: 0, calorias: 0 }
    );

    data.promedioProteinas = +(suma.proteinas / total).toFixed(2);
    data.promedioCarbs = +(suma.carbs / total).toFixed(2);
    data.promedioGrasas = +(suma.grasas / total).toFixed(2);
    data.promedioCalorias = +(suma.calorias / total).toFixed(2);
    return data;
  }

}
