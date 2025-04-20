import { RoleCode } from 'src/shared/types/roles.enum';

export const userMockData = [
  {
    id: '1',
    name: 'John Doe',
    roles: [RoleCode.ADMIN, RoleCode.PERSONAL],
    groups: ['GROUP_1', 'GROUP_2'],
  },
  {
    id: '2',
    name: 'Grabriel Monroe',
    roles: [RoleCode.PERSONAL],
    groups: ['GROUP_1', 'GROUP_2'],
  },
  {
    id: '3',
    name: 'Alex Xavier',
    roles: [RoleCode.PERSONAL],
    groups: ['GROUP_2'],
  },
  {
    id: '4',
    name: 'Jarvis Khan',
    roles: [RoleCode.ADMIN, RoleCode.PERSONAL],
    groups: ['GROUP_2'],
  },
  {
    id: '5',
    name: 'Martines Polok',
    roles: [RoleCode.ADMIN, RoleCode.PERSONAL],
    groups: ['GROUP_1'],
  },
  {
    id: '6',
    name: 'Gabriela Wozniak',
    roles: [RoleCode.VIEWER, RoleCode.PERSONAL],
    groups: ['GROUP_1'],
  },
];
