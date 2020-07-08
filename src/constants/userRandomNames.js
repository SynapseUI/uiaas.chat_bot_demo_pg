export const userNames = ['Aizah Mathews',
  'Aysha Gutierrez',
  'Kennedy Wilde',
  'Riley Everett',
  'Celyn Joyce',
  'Caspar Tucker',
  'Susie Watson',
  'Ann Mcneill',
  'Aariz Findlay',
  'Esha Jacobs',
  'Aamina Hughes',
  'Bree Perez',
  'Aarav Knight',
  'Charles Bowler',
  'Samia Slater',
  'Joy Knapp',
  'Keiron Wheeler',
  'Eric Bauer',
  'Rose Forbes',
  'Amani Kane',
  'Sallie Vincent',
  'Aleah Calvert',
  'Emilie Mclaughlin',
  'Latisha Mccullough',
  'Shayla Perkins',
  'Amy Campbell',
  'Rehan Fischer',
  'Adelina Sears',
  'Kendra Witt',
  'Lilah Drake'];

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateName() {
  const name = userNames[getRandomInt(0, userNames.length + 1)];
  return name;
}
