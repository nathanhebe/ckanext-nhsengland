import ckan.logic as logic


def split_resources(pkg_dict):
    """
    Splits the resources in the provided package based on the format field
    with DOC, DOCX, PDF being returned as documents, all other formats as data
    """
    document_formats = ["DOC", "DOCX", "PDF"]
    documents, data = [], []
    for resource in pkg_dict["resources"]:
        target = documents if resource.get("format", "").upper() in document_formats \
                           else data
        target.append(resource)
    return documents, data


def get_collection(name):
    if name is None:
        return {}
    try:
        return logic.get_action('group_show')({}, {'id': name})
    except (logic.NotFound, logic.ValidationError, logic.NotAuthorized):
        return {}
