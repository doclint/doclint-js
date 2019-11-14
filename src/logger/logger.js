import consola from 'consola'
 
export const logger = consola.create({
  logObject: {
    badge: true
  },
  reporters: [
    new consola.FancyReporter()
  ]
})