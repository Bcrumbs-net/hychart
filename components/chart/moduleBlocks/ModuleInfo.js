const data = {
  BASIC: {
    MESSAGE: {
      color: '#6cb9d5',
      name: 'Message Action',
      moduleName: 'Message Action',
      icon: 'flow-messagemodule-white',
      iconColorful: 'flow-messagemodule-colorful',
      category: 'BASIC',
    },
    SELECTION: {
      color: '#a06e8c',
      name: 'Selection Action',
      moduleName: 'Selection Action',
      icon: 'flow-selectionmodule-white',
      iconColorful: 'flow-selectionmodule-colorful',
      category: 'BASIC',
    },
    AI: {
      color: '#ebb760',
      name: 'AI Action',
      moduleName: 'AI Action',
      icon: 'flow-aimodule-white',
      iconColorful: 'flow-aimodule-colorful',
      category: 'BASIC',
    },
    HANDOVER: {
      color: '#ee2a7b',
      name: 'HUMAN Action',
      moduleName: 'Human Action',
      icon: 'flow-handover-white',
      iconColorful: 'flow-handover-colorful',
      category: 'BASIC',
    },
    SWITCH: {
      color: '#6f9775',
      name: 'BOT Action',
      moduleName: 'Bot Action',
      icon: 'flow-botswitch-white',
      iconColorful: 'flow-botswitch-colorful',
      category: 'BASIC',
    },
    END: {
      color: '#c96751',
      name: 'End Action',
      moduleName: 'End Action',
      icon: 'flow-endmodule-white',
      iconColorful: 'flow-endmodule-colorful',
      category: 'BASIC',
    },
  },
  ADVANCED: {
    INTEGRATION: {
      color: '#bd9e70',
      name: 'Integration Action',
      moduleName: 'Integration Action',
      icon: 'flow-integrationmodule-white',
      iconColorful: 'flow-integrationmodule-colorful',
      category: 'ADVANCED',
    },
    LOGIC: {
      color: '#6f9bbd',
      name: 'LOGIC Action',
      moduleName: 'Logic Action',
      icon: 'flow-logicmodule-white',
      iconColorful: 'flow-logicmodule-colorful',
      category: 'ADVANCED',
    },
    INPUT: {
      color: '#F0D775',
      name: 'INPUT Action',
      moduleName: 'Input Action',
      icon: 'flow-inputmodule-white',
      iconColorful: 'flow-inputmodule-colorful',
      category: 'ADVANCED',
    },
    ZAPIER: {
      color: '#ff4a00',
      name: 'Zapier Action',
      moduleName: 'Zapier Action',
      icon: 'flow-zapiermodule-white',
      iconColorful: 'flow-zapiermodule-colorful',
      category: 'ADVANCED',
    },
    PAYMENT: {
      color: '#2ec6c6',
      name: 'Payment Action',
      moduleName: 'Payment Action',
      icon: 'flow-paymentmodule-white',
      iconColorful: 'flow-paymentmodule-colorful',
      category: 'ADVANCED',
    },
    THIRDPARTY: {
      color: '#00A7FF',
      name: 'Wait For',
      moduleName: 'Wait For Action',
      icon: 'flow-wait-for-action-white',
      iconColorful: 'flow-wait-for-action-colorful',
      category: 'ADVANCED',
    },
    ECOMMERCE: {
      color: '#6f7ce3',
      name: 'E-Commerce',
      moduleName: 'Commerce Action',
      icon: 'flow-ecommercemodule-white',
      iconColorful: 'flow-paymentmodule-colorful',
      category: 'ADVANCED',
    },
    EMAIL: {
      color: '#71dba3',
      name: 'Email Action',
      moduleName: 'Email Action',
      icon: 'flow-email-white',
      iconColorful: 'flow-email-colorful',
      category: 'ADVANCED',
    },
  },
  HIDDEN: {
    START: {
      color: '#3fb98c',
      name: 'Start Action',
      moduleName: 'Start Action',
      icon: 'flow-startmodule-white',
      iconColorful: 'flow-startmodule-colorful',
      category: 'HIDDEN',
    },
    GENERIC: {
      color: '#ff0000',
      name: 'Generic Action Block',
      moduleName: 'Generic Module Block',
      icon: 'flow-startmodule-white',
      iconColorful: 'flow-startmodule-colorful',
      category: 'HIDDEN',
    },
  },
};

class ModuleInfo {
  static getModule(type) {
    let result;
    Object.keys(data).forEach((category) => {
      Object.keys(data[category]).forEach((t) => {
        if (type === t) {
          result = data[category][type];
        }
      });
    });
    return result || data['HIDDEN']['GENERIC'];
  }
  static getCategory() {
    return Object.keys(data);
  }
  static getModuleInfo(type, field) {
    return (
      ModuleInfo.getModule(type)[field] || data['HIDDEN']['GENERIC'][field]
    );
  }
  static getColor(type) {
    return ModuleInfo.getModuleInfo(type, 'color');
  }
  static getName(type) {
    return ModuleInfo.getModuleInfo(type, 'name');
  }
  static getModuleName(type) {
    return ModuleInfo.getModuleInfo(type, 'moduleName');
  }
  static getIcon(type) {
    return ModuleInfo.getModuleInfo(type, 'icon');
  }
  static getIconColorful(type) {
    return ModuleInfo.getModuleInfo(type, 'iconColorful');
  }
  static getMenu(props) {
    return ModuleInfo.getModuleInfo(props.currentModule.type, 'menu')(props);
  }
  static getTypes(category) {
    return Object.keys(data[category]);
  }
}
export default ModuleInfo;
