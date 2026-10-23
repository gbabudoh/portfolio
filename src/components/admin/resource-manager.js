'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Switch, Textarea } from '@/components/ui/field';
import { ImageUpload } from '@/components/admin/image-upload';
import {
  AdminPageHeader,
  Card,
  EmptyState,
  SearchInput,
  Sheet,
  SkeletonRows,
  api,
  useConfirm,
  useToast,
} from '@/components/admin/ui';

/**
 * Config-driven list + create/edit/delete screen used by every content type,
 * so all admin sections share the same layout, behaviour and feedback.
 *
 * fields:  [{ name, label, type, required, options, hint, placeholder, span, showIf, maxLength }]
 *          type: text | url | number | month | textarea | select | switch | image
 *                | section (heading only) | list (string[]) | pairs (object[]) | tags (string[])
 *          required may be a function of the current values; maxLength adds a live counter
 *          list/pairs/tags: maxItems, addLabel; pairs: keys [{ name, label, placeholder, maxLength }]
 * reorder: { endpoint } — ↑ ↓ buttons that POST { ids } in the new order (hidden while searching/filtering)
 * columns: [{ label, render(row), className }] — secondary metadata (hidden on mobile)
 * primary(row): { title, subtitle, media? } — the main cell
 * groupBy: { key, order?, caption?(group) } — render the list in sections by row[key],
 *          in `order` (unknown groups last); the filter dropdown follows the same order
 */
export function ResourceManager({
  endpoint,
  title,
  description,
  singular,
  fields,
  columns = [],
  primary,
  searchKeys = [],
  filter,
  groupBy,
  reorder,
  defaults = {},
  toForm = (row) => row,
  toPayload = (values) => values,
  sort,
  sheetSize = 'md',
  emptyIcon,
}) {
  const toast = useToast();
  const confirm = useConfirm();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [editing, setEditing] = useState(null); // null | 'new' | row
  const [values, setValues] = useState(defaults);
  const [initial, setInitial] = useState(defaults);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api(endpoint);
      setRows(sort ? [...data].sort(sort) : data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  // Deep link: /admin/<resource>?new=1 opens the create panel (used by dashboard shortcuts).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === '1') {
      openEditor('new');
      window.history.replaceState(null, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupOrder = groupBy?.order;
  const compareGroups = useCallback(
    (a, b) => {
      const rank = (v) => {
        const i = groupOrder ? groupOrder.indexOf(v) : -1;
        return i === -1 ? Infinity : i;
      };
      return rank(a) - rank(b) || String(a).localeCompare(String(b));
    },
    [groupOrder]
  );

  const filterOptions = useMemo(() => {
    if (!filter) return [];
    const options = [...new Set(rows.map((r) => r[filter.key]).filter(Boolean))];
    return groupBy?.key === filter.key ? options.sort(compareGroups) : options.sort();
  }, [rows, filter, groupBy, compareGroups]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter && filterValue && row[filter.key] !== filterValue) return false;
      if (!q) return true;
      return searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q));
    });
  }, [rows, query, filter, filterValue, searchKeys]);

  // [[group, rows[]], ...] in display order; rows keep their `sort` order within a group.
  const groups = useMemo(() => {
    if (!groupBy) return null;
    const map = new Map();
    for (const row of visible) {
      const key = row[groupBy.key] || 'Uncategorised';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return [...map.entries()].sort(([a], [b]) => compareGroups(a, b));
  }, [visible, groupBy, compareGroups]);

  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  function openEditor(row) {
    const next = row === 'new' ? { ...defaults } : { ...defaults, ...toForm(row) };
    setValues(next);
    setInitial(next);
    setErrors({});
    setEditing(row);
  }

  async function closeEditor() {
    if (dirty && !saving) {
      const discard = await confirm({
        title: 'Discard unsaved changes?',
        description: 'You have edits that haven’t been saved. They will be lost.',
        confirmLabel: 'Discard',
      });
      if (!discard) return;
    }
    setEditing(null);
  }

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const next = {};
    for (const field of fields) {
      if (field.type === 'section') continue;
      if (field.showIf && !field.showIf(values)) continue;
      const v = values[field.name];
      const required = typeof field.required === 'function' ? field.required(values) : field.required;
      const empty = Array.isArray(v)
        ? v.filter((item) => (typeof item === 'object' ? Object.values(item).some((x) => String(x ?? '').trim()) : String(item).trim())).length === 0
        : v === undefined || v === null || String(v).trim() === '';
      if (required && empty) {
        next[field.name] = field.requiredMessage || `${field.label} is required`;
      }
      if (field.maxLength && typeof v === 'string' && v.trim().length > field.maxLength) {
        next[field.name] = `Keep this under ${field.maxLength} characters`;
      }
      if (field.type === 'url' && v && !/^https?:\/\//i.test(v)) {
        next[field.name] = 'Must start with http:// or https://';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function save(event) {
    event?.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = toPayload(values);
      const isNew = editing === 'new';
      await api(isNew ? endpoint : `${endpoint}/${editing.id}`, {
        method: isNew ? 'POST' : 'PUT',
        body: payload,
      });
      toast(`${capitalise(singular)} ${isNew ? 'created' : 'updated'}`);
      setInitial(values);
      setEditing(null);
      load();
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  // Reordering works on the full, unfiltered list so the saved order is unambiguous.
  const canReorder = Boolean(reorder) && !query.trim() && !filterValue && !groupBy;

  async function move(row, delta) {
    const from = rows.findIndex((r) => r.id === row.id);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= rows.length) return;
    const nextRows = [...rows];
    [nextRows[from], nextRows[to]] = [nextRows[to], nextRows[from]];
    setRows(nextRows);
    try {
      await api(reorder.endpoint, { method: 'POST', body: { ids: nextRows.map((r) => r.id) } });
    } catch (err) {
      toast(err.message, 'error');
      load();
    }
  }

  function renderRow(row) {
    const p = primary(row);
    return (
      <li key={row.id} className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface sm:px-5">
        {p.media !== undefined && (
          <div className="hidden size-12 shrink-0 overflow-hidden rounded-md border border-border bg-subtle sm:block">
            {p.media && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.media} alt="" className="size-full object-cover object-top" loading="lazy" />
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => openEditor(row)}
          className="min-w-0 flex-1 rounded text-left"
        >
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{p.title}</span>
            {p.badge}
          </span>
          {p.subtitle && <span className="mt-0.5 block truncate text-xs text-muted">{p.subtitle}</span>}
        </button>
        {columns.map((col) => (
          <div key={col.label} className={cn('hidden shrink-0 text-sm text-muted md:block', col.className)}>
            {col.render(row)}
          </div>
        ))}
        <div className="flex shrink-0 gap-1">
          {canReorder && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => move(row, -1)}
                disabled={rows[0]?.id === row.id}
                aria-label={`Move ${p.title} up`}
              >
                <ArrowUp />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => move(row, 1)}
                disabled={rows[rows.length - 1]?.id === row.id}
                aria-label={`Move ${p.title} down`}
              >
                <ArrowDown />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => openEditor(row)} aria-label={`Edit ${p.title}`}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(row)}
            aria-label={`Delete ${p.title}`}
            className="hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 />
          </Button>
        </div>
      </li>
    );
  }

  async function remove(row) {
    const label = primary(row).title;
    const ok = await confirm({
      title: `Delete ${singular}?`,
      description: `“${label}” will be permanently removed. This can’t be undone.`,
    });
    if (!ok) return;
    try {
      await api(`${endpoint}/${row.id}`, { method: 'DELETE' });
      setRows((r) => r.filter((x) => x.id !== row.id));
      toast(`${capitalise(singular)} deleted`);
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => openEditor('new')}>
            <Plus />
            New {singular}
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} className="sm:max-w-xs sm:flex-1" />
          {filter && filterOptions.length > 1 && (
            <Select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              aria-label={`Filter by ${filter.label}`}
              className="h-9 sm:w-56"
            >
              <option value="">All {filter.label.toLowerCase()}</option>
              {filterOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Select>
          )}
          <p className="text-xs text-muted sm:ml-auto">
            {loading ? 'Loading…' : `${visible.length} of ${rows.length}`}
          </p>
        </div>

        {loading ? (
          <SkeletonRows />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={rows.length === 0 ? `No ${title.toLowerCase()} yet` : 'No matches'}
            description={rows.length === 0 ? `Create your first ${singular} to get started.` : 'Try a different search or filter.'}
            action={
              rows.length === 0 && (
                <Button variant="secondary" size="sm" onClick={() => openEditor('new')}>
                  <Plus />
                  New {singular}
                </Button>
              )
            }
          />
        ) : groups ? (
          <div>
            {groups.map(([name, items]) => {
              const caption = groupBy.caption?.(name);
              return (
                <section key={name} aria-label={name} className="border-border [&:not(:first-child)]:border-t">
                  <h3 className="flex items-baseline gap-2 border-b border-border bg-surface px-4 py-2 sm:px-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">{name}</span>
                    {caption && <span className="truncate text-xs text-muted">{caption}</span>}
                    <span className="ml-auto font-mono text-xs tabular-nums text-muted">{items.length}</span>
                  </h3>
                  <ul className="divide-y divide-border">{items.map(renderRow)}</ul>
                </section>
              );
            })}
          </div>
        ) : (
          <ul className="divide-y divide-border">{visible.map(renderRow)}</ul>
        )}
      </Card>

      <Sheet
        open={editing !== null}
        onClose={closeEditor}
        size={sheetSize}
        title={editing === 'new' ? `New ${singular}` : `Edit ${singular}`}
        description={
          editing === 'new' ? `Add a new ${singular} to your portfolio.` : editing ? primary(editing).title : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={closeEditor} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="resource-form" disabled={saving || (!dirty && editing !== 'new')}>
              {saving && <Loader2 className="animate-spin" />}
              {editing === 'new' ? `Create ${singular}` : 'Save changes'}
            </Button>
          </>
        }
      >
        <form id="resource-form" onSubmit={save} className="grid gap-5 sm:grid-cols-2" noValidate>
          {fields
            .filter((field) => !field.showIf || field.showIf(values))
            .map((field) => (
              <FormField key={field.name} field={field} values={values} error={errors[field.name]} onChange={setField} />
            ))}
        </form>
      </Sheet>
    </>
  );
}

function FormField({ field, values, error, onChange }) {
  const id = `field-${field.name}`;
  const value = values[field.name] ?? '';
  const span = field.span === 1 ? 'sm:col-span-1' : 'sm:col-span-2';
  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error || field.hint ? `${id}-help` : undefined,
    placeholder: field.placeholder,
  };

  if (field.type === 'section') {
    return (
      <div className="border-t border-border pt-5 first:border-t-0 first:pt-0 sm:col-span-2">
        <p className="text-sm font-semibold">{field.label}</p>
        {field.hint && <p className="mt-0.5 text-xs text-muted">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'switch') {
    return (
      <div className={span}>
        <Switch
          id={id}
          checked={Boolean(values[field.name])}
          onChange={(checked) => onChange(field.name, checked)}
          label={field.label}
          description={field.hint}
        />
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <Field label={field.label} hint={field.hint} error={error} className={span}>
        <ImageUpload
          value={values[field.urlKey]}
          folder={field.folder}
          onChange={({ url, publicId }) => {
            onChange(field.urlKey, url);
            onChange(field.idKey, publicId);
          }}
        />
      </Field>
    );
  }

  let control;
  if (field.type === 'list') {
    control = <ListInput id={id} field={field} value={value} invalid={Boolean(error)} onChange={(v) => onChange(field.name, v)} />;
  } else if (field.type === 'pairs') {
    control = <PairsInput id={id} field={field} value={value} invalid={Boolean(error)} onChange={(v) => onChange(field.name, v)} />;
  } else if (field.type === 'tags') {
    control = <TagsInput id={id} field={field} value={value} invalid={Boolean(error)} onChange={(v) => onChange(field.name, v)} />;
  } else if (field.type === 'textarea') {
    control = <Textarea {...common} rows={field.rows || 4} value={value} onChange={(e) => onChange(field.name, e.target.value)} />;
  } else if (field.type === 'select') {
    control = (
      <Select {...common} value={value} onChange={(e) => onChange(field.name, e.target.value)}>
        <option value="" disabled>Select…</option>
        {field.options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
        {/* Keep legacy values selectable even if they're no longer in the list */}
        {value && !field.options.some((o) => (typeof o === 'string' ? o : o.value) === value) && (
          <option value={value}>{value}</option>
        )}
      </Select>
    );
  } else {
    const type = { url: 'url', number: 'number', month: 'month' }[field.type] || 'text';
    control = (
      <Input
        {...common}
        type={type}
        min={field.min}
        max={field.max}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    );
  }

  const required = typeof field.required === 'function' ? field.required(values) : field.required;
  const length = typeof value === 'string' ? value.trim().length : 0;

  return (
    <div className={cn('space-y-1.5', span)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-medium">
          {field.label}
          {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
        </label>
        {field.maxLength && (
          <span
            className={cn('font-mono text-xs tabular-nums', length > field.maxLength ? 'text-danger' : 'text-muted')}
            aria-live="polite"
          >
            {length}/{field.maxLength}
          </span>
        )}
      </div>
      {control}
      {(error || field.hint) && (
        <p id={`${id}-help`} className={cn('text-xs', error ? 'text-danger' : 'text-muted')}>
          {error || field.hint}
        </p>
      )}
    </div>
  );
}

// Repeatable single-line inputs (string[]). Always shows at least one row.
function ListInput({ id, field, value, invalid, onChange }) {
  const items = Array.isArray(value) && value.length ? value : [''];
  const max = field.maxItems || Infinity;
  const update = (index, text) => onChange(items.map((item, i) => (i === index ? text : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            id={index === 0 ? id : `${id}-${index}`}
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder={field.placeholder}
            aria-label={`${field.label} ${index + 1}`}
            aria-invalid={invalid ? 'true' : undefined}
            maxLength={field.itemMaxLength}
          />
          <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label={`Remove item ${index + 1}`} disabled={items.length === 1 && !item}>
            <X />
          </Button>
        </div>
      ))}
      {items.length < max && (
        <Button variant="secondary" size="sm" onClick={() => onChange([...items, ''])}>
          <Plus />
          {field.addLabel || 'Add item'}
        </Button>
      )}
    </div>
  );
}

// Repeatable rows of several inputs (object[]), e.g. { value, label } results.
function PairsInput({ id, field, value, invalid, onChange }) {
  const blank = Object.fromEntries(field.keys.map((k) => [k.name, '']));
  const items = Array.isArray(value) && value.length ? value : [blank];
  const max = field.maxItems || Infinity;
  const update = (index, key, text) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: text } : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const isBlank = (item) => field.keys.every((k) => !String(item[k.name] ?? '').trim());

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          {field.keys.map((key, k) => (
            <Input
              key={key.name}
              id={index === 0 && k === 0 ? id : undefined}
              value={item[key.name] ?? ''}
              onChange={(e) => update(index, key.name, e.target.value)}
              placeholder={key.placeholder}
              aria-label={`${key.label} ${index + 1}`}
              aria-invalid={invalid ? 'true' : undefined}
              maxLength={key.maxLength}
              className={key.className}
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label={`Remove row ${index + 1}`} disabled={items.length === 1 && isBlank(item)}>
            <X />
          </Button>
        </div>
      ))}
      {items.length < max && (
        <Button variant="secondary" size="sm" onClick={() => onChange([...items, blank])}>
          <Plus />
          {field.addLabel || 'Add row'}
        </Button>
      )}
    </div>
  );
}

// Chips added with Enter or a comma, removed with their × button (string[]).
function TagsInput({ id, field, value, invalid, onChange }) {
  const [draft, setDraft] = useState('');
  const tags = Array.isArray(value) ? value : [];
  const max = field.maxItems || Infinity;

  function commit(text = draft) {
    const next = text
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.some((existing) => existing.toLowerCase() === t.toLowerCase()));
    if (next.length) onChange([...tags, ...next].slice(0, max));
    setDraft('');
  }

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag} className="inline-flex items-center gap-1 rounded-md border border-border bg-subtle py-0.5 pl-2 pr-0.5 text-xs font-medium">
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="grid size-5 place-items-center rounded text-muted hover:bg-background hover:text-foreground"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {tags.length < max && (
        <Input
          id={id}
          value={draft}
          onChange={(e) => (e.target.value.includes(',') ? commit(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && commit()}
          placeholder={field.placeholder}
          aria-invalid={invalid ? 'true' : undefined}
        />
      )}
    </div>
  );
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
