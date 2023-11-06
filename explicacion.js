const fs = require("node:fs");

class ResultadosFutbol {
  constructor(fileName) {
    this.path = fileName;
    this.id = 0;
    if (fs.existsSync(this.path)) {
      try {
        const fileText = fs.readFileSync(this.path, "utf-8");
        this.teams = JSON.parse(fileText);
      } catch {
        this.teams = [];
      }
    } else {
      this.teams = [];
    }
  }

  async saveFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.teams, null, "\t"),
        "utf-8"
      );
    } catch (error) {
      console.log(`[ERROR] ${error}`);
    }
  }

  getTeams() {
    console.log(this.teams);
  }

  async addTeam(team) {
    const teamFinder = this.teams.find((t) => t.code === team.code);

    if (teamFinder) {
      console.log("[ERROR] Team code already exist");
    } else {
      const newTeam = { ...team, id: this.teams.length + 1 };
      this.teams.push(newTeam);

      await this.saveFile();
    }
  }

  async deleteTeam(id) {
    const teamSelected = this.teams.find((p) => p.id == id);

    if (teamSelected) {
      const newTeamsArray = this.teams.filter((p) => p.id != id);

      this.teams = newTeamsArray;

      await this.saveFile();
    } else {
      console.log("[ERROR]");
    }
  }
}

class Team {
  constructor(title, country, code) {
    (this.title = title), (this.country = country), (this.code = code);
  }
}

// MANERA INCORRECTA

/*
 * ADVERTENCIA: Ejecutar este código de manera síncrona puede causar problemas al guardar el archivo
 * "archivo-sincronico.txt". El formato del archivo podría resultar incorrecto debido a que las tareas
 * se ejecutan secuencialmente y no se espera a que se completen.
 *
 * Este código trabaja con promesas, por lo que es esencial utilizar funciones asincrónicas y esperar
 * a que se resuelvan para garantizar su correcta ejecución.
 */
const LigaArgentina = new ResultadosFutbol("./archivo-sincronico.txt");

LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));

LigaArgentina.deleteTeam(1);

LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));
LigaArgentina.addTeam(new Team("Goles FC", "Argentina", "AAA489"));

LigaArgentina.deleteTeam(2);

LigaArgentina.getTeams();

// MANERA CORRECTA N°1

/*
 * En esencia, las dos maneras correctas son las mismas lo único que difiere es la
 * sintaxis. Recomiendo la primera que es más sencilla de entender. Por definición
 * nuestro método addTeam() de la clase ResultadosFutbol es asincronica, devuelve una
 * promesa (ver línea 34). Por lo tanto, a la hora de llamarla lo más correcto es
 * trabajar con funciones async/await. Debemos de esperar que se resuelva esa promesa
 * para poder trabajar con la siguiente. De esta manera no hay errores a la hora del
 * guardado.
 *
 * BONUS TIP: ¿Por qué hacemos una función y no ponemos simplemente lo siguiente:
 * `await LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));`?
 * RTA: Esto es por el operador 'await' que se usa para esperar que se resuelvan promesas.
 * Sin embargo, SOLO podemos usarlo dentro de una 'async function' o en el nivel
 * superior de un módulo (NO APLICA EN ESTE CASO).
 *
 * Dentro de una función async podemos utilizar o mandar a llamar métodos que no lo
 * sean, no hay ningún tipo de problema.
 */

async function lanzarLiga() {
  const LigaArgentina = new ResultadosFutbol("./archivo-asincronico.txt");

  await LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));

  LigaArgentina.getTeams();

  await LigaArgentina.deleteTeam(1);

  await LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));
  await LigaArgentina.addTeam(new Team("Goles FC", "Argentina", "AAA489"));

  await LigaArgentina.deleteTeam(2);

  LigaArgentina.getTeams();
}

lanzarLiga();

// MANERA CORRECTA N° 2

/*
 * Acá lo único que varía es la sintaxis utilizada. Es un poco más rebuscada
 * de leer a simple vista, pero es exactamente lo mismo.
 */

(async () => {
  const LigaArgentina = new ResultadosFutbol("./archivo-asincronico-B.txt");

  await LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));

  LigaArgentina.getTeams();

  await LigaArgentina.deleteTeam(1);

  await LigaArgentina.addTeam(new Team("Atlas FC", "Argentina", "AAA46"));
  await LigaArgentina.addTeam(new Team("Goles FC", "Argentina", "AAA489"));

  await LigaArgentina.deleteTeam(2);

  LigaArgentina.getTeams();
})();
