def before_all(context):
    pass


def before_scenario(context, scenario):
    if "skip" in scenario.tags:
        scenario.skip("Skipped by @skip tag")
