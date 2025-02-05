// Example Data Structure for Space Builder

export const dummyNodes = [
  // Root level group
  {
    id: 'group-1',
    type: 'group',
    position: { x: 100, y: 100 },
    draggable: true,
    selectable: true,
    deletable: true,
    data: { 
      label: 'Main Office',
      type: 'office'
    },
    style: {
      width: 400,
      height: 300,
      padding: 20,
      backgroundColor: 'rgba(240, 240, 240, 0.5)'
    }
  },
  
  // Assets inside group-1
  {
    id: 'asset-1',
    type: 'asset',
    position: { x: 50, y: 50 },
    parentNode: 'group-1',
    extent: 'parent',
    draggable: true,
    selectable: true,
    deletable: true,
    data: {
      label: 'Workstation 1',
      type: 'computer',
      groupId: 'group-1',
      parentId: 'group-1'
    }
  },

  // Nested group inside group-1
  {
    id: 'group-2',
    type: 'group',
    position: { x: 150, y: 100 },
    parentNode: 'group-1',
    extent: 'parent',
    draggable: true,
    selectable: true,
    deletable: true,
    data: {
      label: 'Meeting Room',
      type: 'room'
    },
    style: {
      width: 200,
      height: 150,
      padding: 20,
      backgroundColor: 'rgba(200, 200, 240, 0.5)'
    }
  },

  // Asset inside nested group-2
  {
    id: 'asset-2',
    type: 'asset',
    position: { x: 30, y: 30 },
    parentNode: 'group-2',
    extent: 'parent',
    draggable: true,
    selectable: true,
    deletable: true,
    data: {
      label: 'Projector',
      type: 'device',
      groupId: 'group-2',
      parentId: 'group-2'
    }
  }
];

export const dummyEdges = [
  {
    id: 'e1-2',
    source: 'asset-1',
    target: 'asset-2',
    animated: true
  }
];
