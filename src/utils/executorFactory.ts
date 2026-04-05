import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

function createExecutor(codeLanguage: string): CodeExecutorStrategy {
  if (codeLanguage.toLowerCase() === "python") {
    return new PythonExecutor();
  } else if (codeLanguage.toLowerCase() === "cpp") {
    return new CppExecutor();
  } else if (codeLanguage.toLowerCase() === "java") {
    return new JavaExecutor();
  } else {
    throw new Error("Invalid language");
  }
}

export default createExecutor;
