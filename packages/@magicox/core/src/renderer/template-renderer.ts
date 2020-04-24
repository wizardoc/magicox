import FS from 'fs-extra'
import Path from 'path'
import { getDistPath, renderCustomLabel } from '@magicox/lib'

export class TemplateRenderer {
  static instance: TemplateRenderer

  private constructor(private tpl: string) {}

  // cache the tpl and create instance of TemplateRenderer
  static async createRendererByFileName(
    filename: string
  ): Promise<TemplateRenderer> {
    if (TemplateRenderer.instance) {
      return TemplateRenderer.instance
    }

    const distPath = await getDistPath()
    const tpl = await FS.readFile(Path.join(distPath, filename), 'utf-8')

    return (TemplateRenderer.instance = new TemplateRenderer(tpl))
  }

  static createRendererByTemplate(tpl: string) {
    return (
      TemplateRenderer.instance ??
      (TemplateRenderer.instance = new TemplateRenderer(tpl))
    )
  }

  // replace custom label as the content
  renderLabel(label: RenderLabel, content: string): TemplateRenderer {
    this.tpl = renderCustomLabel(this.tpl, label, content)

    return this
  }

  appendScripts(scripts: string): TemplateRenderer {
    this.tpl = renderCustomLabel(
      this.tpl,
      RenderLabel.SCRIPT_SLOT,
      `<script>${scripts}</script>`
    )

    return this
  }

  get template(): string {
    return this.tpl
  }
}

export enum RenderLabel {
  CONTENT_OUTLET = 'ssr-content-outlet',
  SCRIPT_SLOT = 'script-slot',
}
