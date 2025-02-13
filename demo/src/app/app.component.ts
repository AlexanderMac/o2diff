import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { json } from '@codemirror/lang-json'
import { Compartment, EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import * as o2diff from 'o2diff'

import { sample } from '@app/sample'

type DiffType = 'values' | 'paths' | 'full'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.sass',
  imports: [CommonModule, FormsModule],
})
export class AppComponent implements AfterViewInit {
  cmOriginalEditor!: EditorView
  cmCurrentEditor!: EditorView
  cmChangesEditor!: EditorView
  inputSuccess = ''
  inputError = ''
  diffType: DiffType | undefined
  libVersion = o2diff.getLibVersion()

  @ViewChild('original', { static: false }) original: any
  @ViewChild('current', { static: false }) current: any
  @ViewChild('changes', { static: false }) changes: any

  ngAfterViewInit(): void {
    this.cmOriginalEditor = this._createCmEditor(this.original.nativeElement)
    this.cmCurrentEditor = this._createCmEditor(this.current.nativeElement)
    this.cmChangesEditor = this._createCmEditor(this.changes.nativeElement, true)

    this._setCmEditorText(this.cmOriginalEditor, this._stringifyJson(sample.original))
    this._setCmEditorText(this.cmCurrentEditor, this._stringifyJson(sample.current))
  }

  diff(diffType: DiffType): void {
    this.diffType = diffType

    this._clearMessages()
    const original = this._getObject(this.cmOriginalEditor)
    const current = this._getObject(this.cmCurrentEditor)
    if (original instanceof Error) {
      this.inputError = original.message
      return
    }
    if (current instanceof Error) {
      this.inputError = current.message
      return
    }

    let result: any
    switch (diffType) {
      case 'values':
        result = o2diff.diffValues(original, current)
        break
      case 'paths':
        result = o2diff.diffPaths(original, current)
        break
      case 'full':
        result = o2diff.diff(original, current)
        break
    }

    this.inputSuccess = 'Success'
    this._setCmEditorText(this.cmChangesEditor, this._stringifyJson(result))
  }

  private _createCmEditor(nativeElement: any, isReadonly = false): EditorView {
    const extensions = [basicSetup, json()]
    if (isReadonly) {
      const readonly = new Compartment().of(EditorState.readOnly.of(true))
      extensions.push(readonly)
    }
    return new EditorView({
      parent: nativeElement,
      state: EditorState.create({
        extensions,
      }),
    })
  }

  private _setCmEditorText(cmEditor: EditorView, text: string): void {
    cmEditor.dispatch({
      changes: {
        from: 0,
        to: cmEditor.state.doc.length,
        insert: text,
      },
    })
  }

  private _getObject(cmEditor: EditorView): any | Error {
    const json = cmEditor.state.doc.toString()
    try {
      const result = JSON.parse(json)
      return result
    } catch (err) {
      return <Error>err
    }
  }

  private _stringifyJson(obj: any): string {
    return JSON.stringify(obj, null, ' ')
  }

  private _clearMessages(): void {
    this.inputSuccess = ''
    this.inputError = ''
  }
}
