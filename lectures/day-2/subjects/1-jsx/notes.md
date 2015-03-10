JSX
===

```js
// if
{isOpen && (
  <div>its open</div>
)}

// if/else
{isOpen ? (
  <div>its open</div>
) : (
  <div>its not open</div>
)}

// nested
{isOpen ? (
  <div>its open</div>
) : (
  isSaving ? (
    <div>open and saving</div>
  ) : (
    <div>open, not saving</div>
  )
)}

// spaces with newlines
<button>one</button>{' '}
<button>two</button>
```

