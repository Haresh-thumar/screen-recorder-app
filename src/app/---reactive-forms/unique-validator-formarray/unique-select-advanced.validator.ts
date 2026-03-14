import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export function multiFieldUniqueValidator(fields: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;

    const arr = control as FormArray;
    const seen = new Map<string, number[]>();
    let hasDuplicate = false;

    // Build keys and collect indices
    arr.controls.forEach((c, idx) => {
      const g = c as FormGroup;
      const vals = fields.map((f) => {
        const v = g.get(f)?.value;
        return v === null || v === undefined ? '' : String(v).trim();
      });

      // Skip row if ANY field empty
      const incomplete = vals.some((v) => v === '');
      if (incomplete) return;

      const key = vals.join('__|__');
      if (!seen.has(key)) seen.set(key, [idx]);
      else seen.get(key)!.push(idx);
    });

    // First clear existing duplicateRow errors on involved controls (we will set them below if needed)
    arr.controls.forEach((c) => {
      const g = c as FormGroup;
      // remove duplicateRow from control errors if exists
      fields.forEach((f) => {
        const ctrl = g.get(f);
        if (!ctrl) return;
        const errs = { ...(ctrl.errors ?? {}) };
        if (errs['duplicateRow']) {
          delete errs['duplicateRow'];
          ctrl.setErrors(Object.keys(errs).length ? errs : null, {
            emitEvent: false,
          });
        }
      });
      // also clear group-level duplicateRow if set
      const groupErrs = { ...(g.errors ?? {}) };
      if (groupErrs['duplicateRow']) {
        delete groupErrs['duplicateRow'];
        g.setErrors(Object.keys(groupErrs).length ? groupErrs : null, {
          emitEvent: false,
        });
      }
    });

    // Mark duplicates
    seen.forEach((indexes) => {
      if (indexes.length > 1) {
        hasDuplicate = true;
        indexes.forEach((i) => {
          const g = arr.at(i) as FormGroup;
          // set a group-level error for template convenience
          const ge = { ...(g.errors ?? {}) };
          ge['duplicateRow'] = true;
          g.setErrors(ge, { emitEvent: false });

          // also mark each involved control so you can highlight specific fields if needed
          fields.forEach((f) => {
            const ctrl = g.get(f);
            if (!ctrl) return;
            const ce = { ...(ctrl.errors ?? {}) };
            ce['duplicateRow'] = true;
            ctrl.setErrors(ce, { emitEvent: false });
          });
        });
      }
    });

    // set / clear array level error
    if (hasDuplicate) {
      return { duplicateSelected: true };
    } else {
      return null;
    }
  };
}
