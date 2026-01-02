export interface WordCategory {
  name: string;
  words: string[];
}

export const spanishWords: WordCategory[] = [
  {
    name: "Animales",
    words: [
      "perro", "gato", "elefante", "león", "tigre", "oso", "caballo", "vaca",
      "cerdo", "oveja", "pájaro", "pez", "conejo", "ratón", "jirafa", "zebra",
      "mono", "cocodrilo", "serpiente", "tortuga", "mariposa", "abeja", "araña",
      "ballena", "delfín", "tiburón", "pulpo", "cangrejo", "pingüino", "águila"
    ]
  },
  {
    name: "Comida",
    words: [
      "manzana", "plátano", "naranja", "fresa", "uva", "sandía", "piña", "mango",
      "pan", "queso", "huevo", "leche", "arroz", "pasta", "pizza", "hamburguesa",
      "taco", "paella", "tortilla", "sopa", "ensalada", "pollo", "pescado",
      "carne", "verduras", "tomate", "cebolla", "ajo", "limón", "azúcar"
    ]
  },
  {
    name: "Deportes",
    words: [
      "fútbol", "baloncesto", "tenis", "natación", "ciclismo", "correr", "boxeo",
      "golf", "béisbol", "voleibol", "hockey", "esquí", "surf", "yoga",
      "gimnasia", "atletismo", "rugby", "cricket", "badminton", "ping pong"
    ]
  },
  {
    name: "Profesiones",
    words: [
      "médico", "profesor", "ingeniero", "abogado", "cocinero", "bombero",
      "policía", "enfermera", "arquitecto", "artista", "músico", "actor",
      "periodista", "piloto", "dentista", "veterinario", "farmacéutico",
      "contador", "diseñador", "programador"
    ]
  },
  {
    name: "Transporte",
    words: [
      "coche", "autobús", "tren", "avión", "barco", "bicicleta", "motocicleta",
      "taxi", "metro", "camión", "helicóptero", "yate", "tractor", "ambulancia",
      "patineta", "triciclo", "globo", "submarino", "cohete", "carro"
    ]
  },
  {
    name: "Cuerpo",
    words: [
      "cabeza", "ojo", "nariz", "boca", "oreja", "cuello", "hombro", "brazo",
      "mano", "dedo", "pecho", "espalda", "estómago", "pierna", "pie", "rodilla",
      "cabello", "diente", "lengua", "corazón", "pulmón", "hueso", "músculo"
    ]
  },
  {
    name: "Colores",
    words: [
      "rojo", "azul", "verde", "amarillo", "naranja", "morado", "rosa", "negro",
      "blanco", "gris", "marrón", "dorado", "plateado", "turquesa", "violeta",
      "beige", "coral", "índigo", "magenta", "cian"
    ]
  },
  {
    name: "Naturaleza",
    words: [
      "árbol", "flor", "montaña", "río", "océano", "playa", "sol", "luna",
      "estrella", "nube", "lluvia", "nieve", "viento", "tierra", "arena",
      "roca", "hoja", "raíz", "semilla", "bosque", "desierto", "volcán",
      "cascada", "isla", "valle"
    ]
  },
  {
    name: "Casa",
    words: [
      "casa", "puerta", "ventana", "techo", "pared", "suelo", "cocina",
      "baño", "dormitorio", "sala", "mesa", "silla", "cama", "sofá",
      "refrigerador", "estufa", "espejo", "lámpara", "alfombra", "cortina"
    ]
  },
  {
    name: "Ropa",
    words: [
      "camisa", "pantalón", "vestido", "zapato", "sombrero", "calcetín",
      "chaqueta", "abrigo", "falda", "corbata", "guante", "bufanda",
      "gafas", "reloj", "cinturón", "bolso", "collar", "anillo", "pendiente"
    ]
  }
];

export function getRandomWord(category?: string): string {
  let selectedCategory: WordCategory;
  
  if (category) {
    selectedCategory = spanishWords.find(cat => cat.name === category) || spanishWords[0];
  } else {
    selectedCategory = spanishWords[Math.floor(Math.random() * spanishWords.length)];
  }
  
  const randomIndex = Math.floor(Math.random() * selectedCategory.words.length);
  return selectedCategory.words[randomIndex];
}

export function getAllWords(): string[] {
  return spanishWords.flatMap(category => category.words);
}

export function getRandomWordFromAll(): string {
  const allWords = getAllWords();
  return allWords[Math.floor(Math.random() * allWords.length)];
}

