const data = {
  BASIC: {
    PERSON: {
      color: '#6cb9d5',
      name: 'Person Node',
      moduleName: 'Person Node',
      icon: 'messagemodule-white',
      iconColorful: 'messagemodule-colorful',
      category: 'BASIC',
    },
    SELECTION: {
      color: '#a06e8c',
      name: 'Selection Action',
      moduleName: 'Selection Action',
      icon: 'selectionmodule-white',
      iconColorful: 'selectionmodule-colorful',
      category: 'BASIC',
    },
    AI: {
      color: '#ebb760',
      name: 'AI Action',
      moduleName: 'AI Action',
      icon: 'aimodule-white',
      iconColorful: 'aimodule-colorful',
      category: 'BASIC',
    },
    HANDOVER: {
      color: '#ee2a7b',
      name: 'HUMAN Action',
      moduleName: 'Human Action',
      icon: 'handover-white',
      iconColorful: 'handover-colorful',
      category: 'BASIC',
    },
    SWITCH: {
      color: '#6f9775',
      name: 'BOT Action',
      moduleName: 'Bot Action',
      icon: 'botswitch-white',
      iconColorful: 'botswitch-colorful',
      category: 'BASIC',
    },
    END: {
      color: '#c96751',
      name: 'End Action',
      moduleName: 'End Action',
      icon: 'endmodule-white',
      iconColorful: 'endmodule-colorful',
      category: 'BASIC',
    },
  },
  ADVANCED: {
    INTEGRATION: {
      color: '#bd9e70',
      name: 'Integration Action',
      moduleName: 'Integration Action',
      icon: 'integrationmodule-white',
      iconColorful: 'integrationmodule-colorful',
      category: 'ADVANCED',
    },
    LOGIC: {
      color: '#6f9bbd',
      name: 'LOGIC Action',
      moduleName: 'Logic Action',
      icon: 'logicmodule-white',
      iconColorful: 'logicmodule-colorful',
      category: 'ADVANCED',
    },
    INPUT: {
      color: '#F0D775',
      name: 'INPUT Action',
      moduleName: 'Input Action',
      icon: 'inputmodule-white',
      iconColorful: 'inputmodule-colorful',
      category: 'ADVANCED',
    },
    ZAPIER: {
      color: '#ff4a00',
      name: 'Zapier Action',
      moduleName: 'Zapier Action',
      icon: 'zapiermodule-white',
      iconColorful: 'zapiermodule-colorful',
      category: 'ADVANCED',
    },
    PAYMENT: {
      color: '#2ec6c6',
      name: 'Payment Action',
      moduleName: 'Payment Action',
      icon: 'paymentmodule-white',
      iconColorful: 'paymentmodule-colorful',
      category: 'ADVANCED',
    },
    THIRDPARTY: {
      color: '#00A7FF',
      name: 'Wait For',
      moduleName: 'Wait For Action',
      icon: 'wait-for-action-white',
      iconColorful: 'wait-for-action-colorful',
      category: 'ADVANCED',
    },
    ECOMMERCE: {
      color: '#6f7ce3',
      name: 'E-Commerce',
      moduleName: 'Commerce Action',
      icon: 'ecommercemodule-white',
      iconColorful: 'paymentmodule-colorful',
      category: 'ADVANCED',
    },
    EMAIL: {
      color: '#71dba3',
      name: 'Email Action',
      moduleName: 'Email Action',
      icon: 'email-white',
      iconColorful: 'email-colorful',
      category: 'ADVANCED',
    },
  },
  HIDDEN: {
    START: {
      color: '#3fb98c',
      name: 'Start Action',
      moduleName: 'Start Action',
      icon: 'startmodule-white',
      iconColorful: 'startmodule-colorful',
      category: 'HIDDEN',
    },
    GENERIC: {
      color: '#ff0000',
      name: 'Generic Action Block',
      moduleName: 'Generic Module Block',
      icon: 'startmodule-white',
      iconColorful: 'startmodule-colorful',
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
