export interface Opts {
  selector: string
}

export const initialOpts: Opts = {
  selector: '#foo',
}

export class Name {
  public selector: string

  constructor (public opts = initialOpts) {
    this.opts = Object.assign({}, initialOpts, opts)
  }

  public initialize () {}
}
