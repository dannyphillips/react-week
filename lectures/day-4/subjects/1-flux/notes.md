Flux
====

You might need flux if
----------------------

https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6

> If your app doesn’t have these symptoms and is not likely to develop them in the near future, stay with what works for you.

### your data changes over time

> the very point of Flux is to make data changes easy to reason about

### you want to cache data in memory, but it can change while cached

- keep data around, so that scroll positions can be restored, server
  isn't pinged while navigating, etc.
- get data from multiple places
  - server dumps JSON on the page, no initial ajax
  - ajax fetch when navigating to other pages

### your data is relational and models include and depend on each other

> Say users can follow each other, and when following succeeds, we need
> to update “followers” counter of one user and “following” counter of
> another user, as well as “is following” and “is follower” boolean
> fields to re-render the button state.

> We can implement this as a method on a model, but this means one of
> them will be managed by another one, as in user.followUser(otherUser).
> Such indirection makes bugs trickier to track, and it only gets worse
> if entities of different types need to be updated and rolled back
> together with optimistic updates.

### the same data is assembled from different sources and can be rendered in several places throughout the UI

> the same model collection needs to be fed from two different API
> responses. Turns out, 1:1 correspondence between API responses and
> model objects doesn’t scale!

Flux
----

> Flux isolates all data mutations to a particular layer in the
> application and establishes a completely predictable way to get data
> in and out of there.

> Caching, invalidation, optimistic updates, aggregation, pagination and
> a lot of other things get much easier when models are plain objects
> and don’t try to manage complex updates of each other.

> In Flux, Store is the only place in your whole app that has privilege
> to mutate the data.

> If your app doesn’t have complex data changes and caching, don’t use it.

