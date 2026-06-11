import { cseData } from './cse';
import { itData } from './it';
import { aidsData } from './aids';
import { aimlData } from './aiml';
import { eceData } from './ece';
import { eeeData } from './eee';
import { mechData } from './mech';
import { civilData } from './civil';
import { mcaData } from './mca';
import { managementData } from './management';
import { shData } from './sh';

export const departmentRegistry = {
  cse: cseData,
  it: itData,
  aids: aidsData,
  aiml: aimlData,
  ece: eceData,
  eee: eeeData,
  mech: mechData,
  civil: civilData,
  mca: mcaData,
  management: managementData,
  sh: shData,
};

export const getDepartmentData = async (id) => {
  // Simulate an async API/Backend fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(departmentRegistry[id] || null);
    }, 600); // Premium artificial delay to show off cinematic loaders
  });
};
