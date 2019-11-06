// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>test</h2>
    <hr />
    <div>State: <span id="label">--</span></div>
    <hr />
    <ui-button id="btn">Send To Main</ui-button>
    <hr />
    <ui-button id="save">SaveLevel</ui-button>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    save: '#save',
    label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    this.$btn.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('test:clicked');
    });
    this.$save.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('test:savelevel');
    });
  },

  // register your ipc messages here
  messages: {
    'test:hello'(event) {
      this.$label.innerText = 'Hello!';
    },

    'scene:query-node'(event) {
      JSON.parse(event);
    },
  }
});