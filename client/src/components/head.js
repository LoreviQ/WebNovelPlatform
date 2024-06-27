import React from "react";
import { Helmet } from "react-helmet";

function MyHead() {
    return (
        <Helmet>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="description" content="WebNovelPlatform example Site" />
            <meta name="author" content="Oliver Jay" />
        </Helmet>
    );
}

export default MyHead;
