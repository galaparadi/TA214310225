const dataSource = require('../datasource/datasource');

exports.documentDetail = async (req, res, next) => {
    try {
        let { status, data } = await dataSource.Workspaces().getDocument({ name: req.body.workspacename, id: req.body.id })
        let workspace = req.body.workspacename;
        res.render("ajax/document-detail", {
            name: workspace,
            document: {
                _id: data.documentId._id,
                name: data.name,
                author: data.creator,
                version: data.documentId.version,
                currentVersion: String(data.documentId.version.length)
            },
            layout: false
        })
        return true;
    } catch (err) {
        next(err);
        console.log(err);
        return false;
    }
}

exports.fileDashboard = async (req, res, next) => {
    try {
        let documents = (await dataSource.Workspaces().getDocuments({ name: req.body.workspacename })).data;
        res.render("ajax/file-dashboard", { documents, layout: false })
        return true;
    } catch (err) {
        console.log(err);
        res.send("error sending data")
        return false;
    }
}
