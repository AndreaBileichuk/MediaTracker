using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public class GeneralErrors
{
    public static readonly Error SomethingWentWrong = new(
        "General.Wrong",
        "Something went wrong."
    );

}