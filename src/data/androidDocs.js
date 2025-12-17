const androidDocs = {
  modules: [
    {
      name: 'Base Integration',
      steps: [
        {
          title: 'Add SDK',
          blocks: [
            { type: 'text', content: '<p>Install the SDK via Gradle:</p>' },
            {
              type: 'code',
              languages: [
                { lang: 'java', label: 'Java', content: 'implementation "com.sdk:1.0.0"' },
                { lang: 'kotlin', label: 'Kotlin', content: 'implementation("com.sdk:1.0.0")' }
              ]
            },
            { type: 'note', content: 'Note: Use the latest version for best compatibility.' },
            { type: 'image', url: 'https://via.placeholder.com/400x200', alt: 'Gradle Example' }
          ]
        },
        {
          title: 'Initialize',
          blocks: [
            { type: 'text', content: '<p>Initialize in your Application class:</p>' },
            {
              type: 'code',
              languages: [
                { lang: 'java', label: 'Java', content: 'SDK.init(this);' },
                { lang: 'kotlin', label: 'Kotlin', content: 'SDK.init(this)' }
              ]
            },
            { type: 'gif', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' }
          ]
        }
      ]
    },
    {
      name: 'Push Integration',
      steps: [
        {
          title: 'Enable Push',
          blocks: [
            { type: 'text', content: '<p>Enable push notifications in your manifest:</p>' },
            { type: 'code', language: 'xml', content: '<receiver android:name=".PushReceiver" />' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
          ]
        }
      ],
      submodules: [
        {
          name: 'AppInbox',
          steps: [
            {
              title: 'Enable AppInbox',
              blocks: [
                { type: 'text', content: '<p>Enable AppInbox in your dashboard and initialize in your app.</p>' },
                { type: 'code', language: 'java', content: 'AppInbox.init(this);' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default androidDocs; 