![Logo](https://www.signum.io/img/logo.png)

# Signum Workshop Web App

## Rewrite Development Branch

## Building

This project uses [`sgnbuild`](https://www.signum.io/sgnbuild). Simply install and run `sgnbuild` from npm.

```sh
# sudo on UNIX-like systems
npm install --global sgnbuild

git clone -b rewrite https://github.com/SignumCollective/signum-workshop-client
cd signum-workshop-client

sgnbuild
```

## Contributing

We have a [Contributor License Agreement](https://www.clahub.com/agreements/SignumCollective/signum-workshop-client) on CLAHub you must sign prior to contributing. Please follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for any JavaScript and the [Airbnb CSS Style Guide](https://github.com/airbnb/css) for any CSS. HTML should follow these simple rules:

1.  Always use 2-space soft tabs

     Example:

    ```html
    <article>
      Insert words here.
      <figure>
        <img src="image" />
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </article>
    ```

2.  Always use `/>` at the end of any tags without a closing tag.

    Example:

    ```html
    <img src="image" />
    ```

3.  Always have a `<!DOCTYPE html>` declaration at the top of the page.

    This is the only exception to rule #2.

    Example:

    ```html
    <!DOCTYPE html>
    <html>
      ...contents...
    </html>
    ```

## License

This software is released under the [Apache License version 2](LICENSE.md).
